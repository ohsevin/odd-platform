package org.opendatadiscovery.oddplatform.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.Record3;
import org.jooq.SelectConditionStep;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.opendatadiscovery.oddplatform.dto.DataEntityClassDto;
import org.opendatadiscovery.oddplatform.dto.DataEntityTypeDto;
import org.opendatadiscovery.oddplatform.dto.FacetStateDto;
import org.opendatadiscovery.oddplatform.dto.FacetType;
import org.opendatadiscovery.oddplatform.dto.SearchFilterId;
import org.opendatadiscovery.oddplatform.model.tables.pojos.SearchFacetsPojo;
import org.opendatadiscovery.oddplatform.model.tables.records.SearchFacetsRecord;
import org.opendatadiscovery.oddplatform.repository.util.JooqFTSHelper;
import org.opendatadiscovery.oddplatform.utils.Pair;
import org.springframework.stereotype.Repository;

import static org.jooq.impl.DSL.coalesce;
import static org.jooq.impl.DSL.count;
import static org.jooq.impl.DSL.countDistinct;
import static org.jooq.impl.DSL.field;
import static org.opendatadiscovery.oddplatform.model.Tables.DATA_ENTITY;
import static org.opendatadiscovery.oddplatform.model.Tables.DATA_SOURCE;
import static org.opendatadiscovery.oddplatform.model.Tables.GROUP_ENTITY_RELATIONS;
import static org.opendatadiscovery.oddplatform.model.Tables.OWNER;
import static org.opendatadiscovery.oddplatform.model.Tables.OWNERSHIP;
import static org.opendatadiscovery.oddplatform.model.Tables.SEARCH_ENTRYPOINT;
import static org.opendatadiscovery.oddplatform.model.Tables.SEARCH_FACETS;
import static org.opendatadiscovery.oddplatform.model.Tables.TAG;
import static org.opendatadiscovery.oddplatform.model.Tables.TAG_TO_DATA_ENTITY;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SearchFacetRepositoryImpl implements SearchFacetRepository {
    private static final Collector<Record3<Long, String, Integer>, ?, Map<SearchFilterId, Long>> FACET_COLLECTOR
        = Collectors.toMap(
        r -> SearchFilterId.builder().entityId(r.component1()).name(r.component2()).build(),
        r -> r.component3().longValue()
    );
    private final DSLContext dslContext;
    private final JooqFTSHelper jooqFTSHelper;

    @Override
    public SearchFacetsPojo persistFacetState(final SearchFacetsPojo pojo) {
        final SearchFacetsRecord searchFacetsRecord = dslContext.newRecord(SEARCH_FACETS, pojo);
        searchFacetsRecord.store();
        return searchFacetsRecord.into(SearchFacetsPojo.class);
    }

    @Override
    public SearchFacetsPojo updateFacetState(final SearchFacetsPojo pojo) {
        final SearchFacetsRecord record = dslContext.newRecord(SEARCH_FACETS, pojo);
        record.changed(SEARCH_FACETS.ID, false);
        record.store();
        return pojo;
    }

    @Override
    public Optional<SearchFacetsPojo> getFacetState(final UUID id) {
        return dslContext.update(SEARCH_FACETS)
            .set(SEARCH_FACETS.LAST_ACCESSED_AT, DSL.currentOffsetDateTime())
            .where(SEARCH_FACETS.ID.eq(id))
            .returning()
            .fetchOptionalInto(SearchFacetsPojo.class);
    }

    @Override
    public Map<SearchFilterId, Long> getEntityClassFacet(final FacetStateDto state) {
        final List<Condition> conditions = getDefaultConditions();

        final String entityClassUnnestedField = "entity_class_id";
        final String deCountField = "data_entity_count";

        var select = dslContext
            .select(field("unnest(?)", DATA_ENTITY.ENTITY_CLASS_IDS).as(entityClassUnnestedField))
            .select(count(DATA_ENTITY.ID).as(deCountField))
            .from(DATA_ENTITY);

        if (StringUtils.isNotEmpty(state.getQuery())) {
            select = select.join(SEARCH_ENTRYPOINT)
                .on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(jooqFTSHelper.ftsCondition(SEARCH_ENTRYPOINT.SEARCH_VECTOR, state.getQuery()));
        }

        final Set<Long> dataSourceIds = state.getFacetEntitiesIds(FacetType.DATA_SOURCES);
        if (!CollectionUtils.isEmpty(dataSourceIds)) {
            conditions.add(DATA_ENTITY.DATA_SOURCE_ID.in(dataSourceIds));
        }

        final Set<Long> ownerIds = state.getFacetEntitiesIds(FacetType.OWNERS);
        if (!CollectionUtils.isEmpty(ownerIds)) {
            select = select.join(OWNERSHIP)
                .on(OWNERSHIP.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(OWNERSHIP.OWNER_ID.in(ownerIds));
        }

        final Set<Long> namespaceIds = state.getFacetEntitiesIds(FacetType.NAMESPACES);
        if (!CollectionUtils.isEmpty(namespaceIds)) {
            select = select.join(DATA_SOURCE)
                .on(DATA_SOURCE.ID.eq(DATA_ENTITY.DATA_SOURCE_ID))
                .and(DATA_SOURCE.NAMESPACE_ID.in(namespaceIds));
        }

        final Set<Long> tagIds = state.getFacetEntitiesIds(FacetType.TAGS);
        if (!CollectionUtils.isEmpty(tagIds)) {
            select = select.join(TAG_TO_DATA_ENTITY)
                .on(TAG_TO_DATA_ENTITY.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(TAG_TO_DATA_ENTITY.TAG_ID.in(tagIds));
        }

        final Set<Long> groupIds = state.getFacetEntitiesIds(FacetType.GROUPS);
        if (!CollectionUtils.isEmpty(groupIds)) {
            select = select.join(GROUP_ENTITY_RELATIONS)
                .on(GROUP_ENTITY_RELATIONS.DATA_ENTITY_ODDRN.eq(DATA_ENTITY.ODDRN));

            final SelectConditionStep<Record1<String>> groupOddrns = DSL.select(DATA_ENTITY.ODDRN)
                .from(DATA_ENTITY)
                .where(DATA_ENTITY.ID.in(groupIds));
            conditions.add(GROUP_ENTITY_RELATIONS.GROUP_ODDRN.in(groupOddrns));
        }

        final Set<Long> typeIds = state.getFacetEntitiesIds(FacetType.TYPES);
        if (!CollectionUtils.isEmpty(typeIds)) {
            conditions.add(DATA_ENTITY.TYPE_ID.in(typeIds));
        }

        final Stream<Pair<SearchFilterId, Long>> entityClasses = select
            .where(conditions)
            .groupBy(field(entityClassUnnestedField))
            .fetchStream()
            .map(r -> {
                final Integer entityClassId = r.get(entityClassUnnestedField, Integer.class);

                final DataEntityClassDto entityClass = DataEntityClassDto.findById(entityClassId)
                    .orElseThrow(() -> new IllegalArgumentException(
                        String.format("There's no entity class with id %d", entityClassId)));

                return Pair.of(entityClassToSearchFilter(entityClass), r.get(deCountField, Long.class));
            });

        final Stream<Pair<SearchFilterId, Long>> allEntityClasses = Arrays
            .stream(DataEntityClassDto.values())
            .map(s -> Pair.of(entityClassToSearchFilter(s), 0L));

        return Stream.concat(entityClasses, allEntityClasses)
            .collect(Collectors.toMap(Pair::getLeft, Pair::getRight, (c1, c2) -> c1 == 0 ? c2 : c1));
    }

    @Override
    public Map<SearchFilterId, Long> getTypeFacet(final String facetQuery,
                                                  final int page,
                                                  final int size,
                                                  final FacetStateDto state) {
        final Long selectedEntityClass = state.selectedDataEntityClass().orElse(null);

        if (selectedEntityClass == null) {
            return Map.of();
        }

        final List<Condition> conditions = getDefaultConditions();

        var select = dslContext
            .select(DATA_ENTITY.TYPE_ID, count(DATA_ENTITY.ID))
            .from(DATA_ENTITY);

        if (StringUtils.isNotEmpty(state.getQuery())) {
            select = select.join(SEARCH_ENTRYPOINT)
                .on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(jooqFTSHelper.ftsCondition(SEARCH_ENTRYPOINT.SEARCH_VECTOR, state.getQuery()));
        }

        final Set<Long> dataSourceIds = state.getFacetEntitiesIds(FacetType.DATA_SOURCES);
        if (!CollectionUtils.isEmpty(dataSourceIds)) {
            conditions.add(DATA_ENTITY.DATA_SOURCE_ID.in(dataSourceIds));
        }

        final Set<Long> ownerIds = state.getFacetEntitiesIds(FacetType.OWNERS);
        if (!CollectionUtils.isEmpty(ownerIds)) {
            select = select.join(OWNERSHIP)
                .on(OWNERSHIP.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(OWNERSHIP.OWNER_ID.in(ownerIds));
        }

        final Set<Long> namespaceIds = state.getFacetEntitiesIds(FacetType.NAMESPACES);
        if (!CollectionUtils.isEmpty(namespaceIds)) {
            select = select.join(DATA_SOURCE)
                .on(DATA_SOURCE.ID.eq(DATA_ENTITY.DATA_SOURCE_ID))
                .and(DATA_SOURCE.NAMESPACE_ID.in(namespaceIds));
        }

        final Set<Long> tagIds = state.getFacetEntitiesIds(FacetType.TAGS);
        if (!CollectionUtils.isEmpty(tagIds)) {
            select = select.join(TAG_TO_DATA_ENTITY)
                .on(TAG_TO_DATA_ENTITY.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
                .and(TAG_TO_DATA_ENTITY.TAG_ID.in(tagIds));
        }

        var whereSelect = select
            .where(conditions)
            .and(DATA_ENTITY.ENTITY_CLASS_IDS.contains(new Integer[] {selectedEntityClass.intValue()}));

        final List<Integer> typeIds = typeIdsByName(facetQuery);

        if (!typeIds.isEmpty()) {
            whereSelect = whereSelect.and(DATA_ENTITY.TYPE_ID.in(typeIds));
        }

        final Stream<Pair<SearchFilterId, Long>> types = whereSelect
            .groupBy(DATA_ENTITY.TYPE_ID)
            .orderBy(count(DATA_ENTITY.ID).desc())
            .limit(size)
            .offset((page - 1) * size)
            .fetchStream()
            .map(r -> {
                final DataEntityTypeDto type = DataEntityTypeDto.findById(r.component1())
                    .orElseThrow(() -> new IllegalArgumentException(
                        String.format("There's no type with id %d", r.component1())));

                return Pair.of(typeToSearchFilter(type), r.component2().longValue());
            });

        final Stream<Pair<SearchFilterId, Long>> allTypes = DataEntityClassDto
            .findById(selectedEntityClass.intValue())
            .map(DataEntityClassDto::getTypes)
            .stream()
            .flatMap(Set::stream)
            .map(s -> Pair.of(typeToSearchFilter(s), 0L));

        return Stream.concat(types, allTypes)
            .filter(s -> StringUtils.isEmpty(facetQuery)
                || StringUtils.containsIgnoreCase(facetQuery, s.getLeft().getName()))
            .collect(Collectors.toMap(Pair::getLeft, Pair::getRight, (c1, c2) -> c1 == 0 ? c2 : c1));
    }

    @Override
    public Map<SearchFilterId, Long> getOwnerFacet(final String facetQuery,
                                                   final int page,
                                                   final int size,
                                                   final FacetStateDto state) {
        var select = dslContext.select(OWNER.ID, OWNER.NAME, countDistinct(SEARCH_ENTRYPOINT.DATA_ENTITY_ID))
            .from(OWNER)
            .leftJoin(OWNERSHIP).on(OWNERSHIP.OWNER_ID.eq(OWNER.ID))
            .leftJoin(SEARCH_ENTRYPOINT).on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(OWNERSHIP.DATA_ENTITY_ID));

        if (StringUtils.isNotEmpty(state.getQuery())) {
            select = select.and(jooqFTSHelper.ftsCondition(SEARCH_ENTRYPOINT.SEARCH_VECTOR, state.getQuery()));
        }

        select = select
            .leftJoin(DATA_ENTITY)
            .on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(DATA_ENTITY.ID)).and(DATA_ENTITY.HOLLOW.isFalse());

        final Long selectedEntityClass = state.selectedDataEntityClass().orElse(null);

        if (selectedEntityClass != null) {
            select = select.and(DATA_ENTITY.ENTITY_CLASS_IDS.contains(new Integer[] {selectedEntityClass.intValue()}));
        }

        final Set<Long> dataSourceIds = state.getFacetEntitiesIds(FacetType.DATA_SOURCES);
        if (!dataSourceIds.isEmpty()) {
            select = select.join(DATA_SOURCE)
                .on(DATA_SOURCE.ID.eq(DATA_ENTITY.DATA_SOURCE_ID))
                .and(DATA_SOURCE.ID.in(dataSourceIds));
        }

        final List<Condition> conditions = getDefaultConditions();
        conditions.add(OWNER.NAME.containsIgnoreCase((StringUtils.isNotEmpty(facetQuery) ? facetQuery : "")));
        conditions.add(OWNER.IS_DELETED.isFalse());
        return select
            .where(conditions)
            .groupBy(OWNER.ID, OWNER.NAME)
            .orderBy(countDistinct(SEARCH_ENTRYPOINT.DATA_ENTITY_ID).desc())
            .limit(size)
            .offset((page - 1) * size)
            .fetchStream()
            .collect(FACET_COLLECTOR);
    }

    @Override
    public Map<SearchFilterId, Long> getTagFacet(final String facetQuery,
                                                 final int page,
                                                 final int size,
                                                 final FacetStateDto state) {
        var select = dslContext.select(TAG.ID, TAG.NAME, countDistinct(SEARCH_ENTRYPOINT.DATA_ENTITY_ID))
            .from(TAG)
            .leftJoin(TAG_TO_DATA_ENTITY).on(TAG_TO_DATA_ENTITY.TAG_ID.eq(TAG.ID))
            .leftJoin(SEARCH_ENTRYPOINT).on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(TAG_TO_DATA_ENTITY.DATA_ENTITY_ID));

        if (StringUtils.isNotEmpty(state.getQuery())) {
            select = select.and(jooqFTSHelper.ftsCondition(SEARCH_ENTRYPOINT.SEARCH_VECTOR, state.getQuery()));
        }

        select = select
            .leftJoin(DATA_ENTITY)
            .on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(DATA_ENTITY.ID))
            .and(DATA_ENTITY.HOLLOW.isFalse());

        final Long selectedEntityClass = state.selectedDataEntityClass().orElse(null);

        if (selectedEntityClass != null) {
            select = select.and(DATA_ENTITY.ENTITY_CLASS_IDS.contains(new Integer[] {selectedEntityClass.intValue()}));
        }

        final Set<Long> dataSourceIds = state.getFacetEntitiesIds(FacetType.DATA_SOURCES);
        if (!dataSourceIds.isEmpty()) {
            select = select.join(DATA_SOURCE)
                .on(DATA_SOURCE.ID.eq(DATA_ENTITY.DATA_SOURCE_ID))
                .and(DATA_SOURCE.ID.in(dataSourceIds));
        }

        final List<Condition> conditions = getDefaultConditions();
        conditions.add(TAG.NAME.containsIgnoreCase(StringUtils.isNotEmpty(facetQuery) ? facetQuery : ""));
        conditions.add(TAG.IS_DELETED.isFalse());

        return select
            .where(conditions)
            .groupBy(TAG.ID, TAG.NAME)
            .orderBy(countDistinct(SEARCH_ENTRYPOINT.DATA_ENTITY_ID).desc())
            .limit(size)
            .offset((page - 1) * size)
            .fetchStream()
            .collect(FACET_COLLECTOR);
    }

    @Override
    public Map<SearchFilterId, Long> getGroupFacet(final String facetQuery,
                                                   final int page,
                                                   final int size,
                                                   final FacetStateDto state) {
        final Field<Integer> dataEntityCount = countDistinct(DATA_ENTITY.ID).as("data_entity_count");
        var cteSelect = DSL.select(
                GROUP_ENTITY_RELATIONS.GROUP_ODDRN,
                dataEntityCount)
            .from(GROUP_ENTITY_RELATIONS)
            .leftJoin(DATA_ENTITY).on(GROUP_ENTITY_RELATIONS.DATA_ENTITY_ODDRN.eq(DATA_ENTITY.ODDRN));
        final Long selectedEntityClass = state.selectedDataEntityClass().orElse(null);
        if (selectedEntityClass != null) {
            cteSelect =
                cteSelect.and(DATA_ENTITY.ENTITY_CLASS_IDS.contains(new Integer[] {selectedEntityClass.intValue()}));
        }

        cteSelect = cteSelect.leftJoin(SEARCH_ENTRYPOINT).on(SEARCH_ENTRYPOINT.DATA_ENTITY_ID.eq(DATA_ENTITY.ID));
        if (StringUtils.isNotEmpty(state.getQuery())) {
            cteSelect = cteSelect.and(jooqFTSHelper.ftsCondition(SEARCH_ENTRYPOINT.SEARCH_VECTOR, state.getQuery()));
        }

        final Set<Long> dataSourceIds = state.getFacetEntitiesIds(FacetType.DATA_SOURCES);
        if (!dataSourceIds.isEmpty()) {
            cteSelect = cteSelect.join(DATA_SOURCE)
                .on(DATA_SOURCE.ID.eq(DATA_ENTITY.DATA_SOURCE_ID))
                .and(DATA_SOURCE.ID.in(dataSourceIds));
        }
        cteSelect
            .where(getDefaultConditions())
            .groupBy(GROUP_ENTITY_RELATIONS.GROUP_ODDRN)
            .orderBy(dataEntityCount.desc());

        final Table<? extends Record> cte = cteSelect.asTable("cte");
        final Field<String> groupName = coalesce(DATA_ENTITY.INTERNAL_NAME, DATA_ENTITY.EXTERNAL_NAME);

        final List<Condition> conditions = getDefaultConditions();
        if (StringUtils.isNotEmpty(facetQuery)) {
            conditions.add(groupName.containsIgnoreCase(facetQuery));
        }
        return dslContext.with(cte.getName())
            .as(cteSelect)
            .select(DATA_ENTITY.ID, groupName, cte.field(dataEntityCount))
            .from(cte.getName())
            .join(DATA_ENTITY).on(cte.field(GROUP_ENTITY_RELATIONS.GROUP_ODDRN).eq(DATA_ENTITY.ODDRN))
            .where(conditions)
            .orderBy(cte.field(dataEntityCount).desc())
            .limit(size)
            .offset((page - 1) * size)
            .fetchStream()
            .collect(FACET_COLLECTOR);
    }

    private List<Integer> typeIdsByName(final String name) {
        return Arrays.stream(DataEntityTypeDto.values())
            .filter(s -> StringUtils.containsIgnoreCase(name, s.name()))
            .map(DataEntityTypeDto::getId)
            .toList();
    }

    private SearchFilterId typeToSearchFilter(final DataEntityTypeDto type) {
        return SearchFilterId.builder()
            .entityId(type.getId())
            .name(type.name())
            .build();
    }

    private SearchFilterId entityClassToSearchFilter(final DataEntityClassDto entityClass) {
        return SearchFilterId.builder()
            .entityId(entityClass.getId())
            .name(entityClass.name())
            .build();
    }

    private List<Condition> getDefaultConditions() {
        final List<Condition> conditions = new ArrayList<>();
        conditions.add(DATA_ENTITY.HOLLOW.isFalse());
        conditions.add(DATA_ENTITY.DELETED_AT.isNull());
        conditions.add(DATA_ENTITY.EXCLUDE_FROM_SEARCH.isNull().or(DATA_ENTITY.EXCLUDE_FROM_SEARCH.isFalse()));
        return conditions;
    }
}
