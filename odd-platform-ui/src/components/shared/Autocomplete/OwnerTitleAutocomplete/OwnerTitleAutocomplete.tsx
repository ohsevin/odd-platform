import React, { HTMLAttributes } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Autocomplete, AutocompleteRenderInputParams, Typography } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { OwnershipFormData, Title } from 'generated-sources';
import {
  AutocompleteInputChangeReason,
  createFilterOptions,
  FilterOptionsState,
} from '@mui/material/useAutocomplete';
import { AutocompleteSuggestion, AppInput } from 'components/shared';
import { ClearIcon } from 'components/shared/Icons';
import { useAppDispatch } from 'redux/lib/hooks';
import { fetchOwnershipTitleList } from 'redux/thunks';

interface OwnershipTitleAutocompleteProps {
  field: ControllerRenderProps<OwnershipFormData, 'titleName'>;
}

const OwnershipTitleAutocomplete: React.FC<OwnershipTitleAutocompleteProps> = ({
  field,
}) => {
  const dispatch = useAppDispatch();
  const searchTitles = fetchOwnershipTitleList;

  type TitleFilterOption = Omit<Title, 'id' | 'name'> & Partial<Title>;
  const [titlesOptions, setTitlesOptions] = React.useState<TitleFilterOption[]>([]);
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false);
  const [titlesLoading, setTitlesLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const titlesFilter = createFilterOptions<TitleFilterOption>();

  const handleTitlesSearch = React.useCallback(
    useDebouncedCallback(() => {
      setTitlesLoading(true);
      dispatch(searchTitles({ page: 1, size: 30, query }))
        .unwrap()
        .then(({ titleList }) => {
          setTitlesLoading(false);
          setTitlesOptions(titleList);
        });
    }, 500),
    [searchTitles, setTitlesLoading, setTitlesOptions]
  );

  const onTitlesSearchInputChange = React.useCallback(
    (
      _: React.ChangeEvent<unknown>,
      inputQuery: string,
      reason: AutocompleteInputChangeReason
    ) => {
      if (reason === 'input') setQuery(inputQuery);
      else setQuery('');
    },
    [setQuery]
  );

  React.useEffect(() => {
    setTitlesLoading(autocompleteOpen);
    if (autocompleteOpen) handleTitlesSearch();
  }, [autocompleteOpen, handleTitlesSearch]);

  const getOptionLabel = React.useCallback((option: TitleFilterOption | string) => {
    if (typeof option === 'string') return option;
    if ('name' in option && option.name) return option.name;
    return '';
  }, []);

  const getTitleFilterOptions = (
    filterOptions: TitleFilterOption[],
    params: FilterOptionsState<TitleFilterOption>
  ) => {
    const filtered = titlesFilter(filterOptions, params);
    if (
      query !== '' &&
      !titlesLoading &&
      !filterOptions.some(option => option.name === query)
    ) {
      return [...filtered, { name: query }];
    }
    return filtered;
  };

  const onAutocompleteChange = (
    _: React.SyntheticEvent,
    data: string | null | TitleFilterOption
  ): void => {
    if (!data || typeof data === 'string') field.onChange(data);
    else field.onChange(data.name);
  };

  const handleOpen = () => setAutocompleteOpen(true);
  const handleClose = () => setAutocompleteOpen(false);

  const isOptionEqualToValue = (option: TitleFilterOption, value: TitleFilterOption) =>
    option.name === value.name;

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <AppInput
      {...params}
      sx={{ mt: 1.5 }}
      ref={params.InputProps.ref}
      label='Title'
      placeholder='Search title'
      customEndAdornment={{
        variant: 'loader',
        showAdornment: titlesLoading,
        position: { mr: 4 },
      }}
    />
  );

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: TitleFilterOption
  ) => (
    <li {...props}>
      <Typography variant='body2'>
        {option.id ? (
          option.name
        ) : (
          <AutocompleteSuggestion optionLabel='title' optionName={option.name} />
        )}
      </Typography>
    </li>
  );

  return (
    <Autocomplete
      {...field}
      fullWidth
      open={autocompleteOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      onChange={onAutocompleteChange}
      onInputChange={onTitlesSearchInputChange}
      getOptionLabel={getOptionLabel}
      options={titlesOptions}
      filterOptions={getTitleFilterOptions}
      loading={titlesLoading}
      isOptionEqualToValue={isOptionEqualToValue}
      handleHomeEndKeys
      selectOnFocus
      blurOnSelect
      freeSolo
      clearIcon={<ClearIcon />}
      renderInput={renderInput}
      renderOption={renderOption}
    />
  );
};

export default OwnershipTitleAutocomplete;
