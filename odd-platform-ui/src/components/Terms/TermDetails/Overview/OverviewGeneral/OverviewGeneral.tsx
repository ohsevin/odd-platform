import React from 'react';
import { Grid } from '@mui/material';
import { format } from 'date-fns';
import {
  LabeledInfoItem,
  ConfirmationDialog,
  AppButton,
  AppIconButton,
  LabelItem,
} from 'components/shared';
import { EditIcon, AddIcon, DeleteIcon } from 'components/shared/Icons';
import { deleteTermOwnership } from 'redux/thunks';
import { useAppDispatch, useAppSelector } from 'redux/lib/hooks';
import { useAppParams } from 'lib/hooks';
import { getTermDetails } from 'redux/selectors/terms.selectors';
import { getTermOwnership } from 'redux/selectors';
import OwnershipForm from '../../Ownership/OwnershipForm';
import { OwnerActionBtns, OwnerItem } from './OverviewGeneralStyles';

const OverviewGeneral: React.FC = () => {
  const dispatch = useAppDispatch();
  const { termId } = useAppParams();

  const termDetails = useAppSelector(state => getTermDetails(state, termId));
  const ownership = useAppSelector(state => getTermOwnership(state, termId));

  const handleOwnershipDelete = (ownershipId: number) => () =>
    dispatch(deleteTermOwnership({ termId, ownershipId }));

  const createdAt = termDetails.createdAt && format(termDetails.createdAt, 'd MMM yyyy');

  return (
    <Grid container>
      <Grid item container sm={12}>
        <Grid item sm={12}>
          <LabeledInfoItem inline label='Namespace' labelWidth={4}>
            {termDetails.namespace?.name}
          </LabeledInfoItem>
        </Grid>
        <Grid item sm={12}>
          <LabeledInfoItem inline label='Created' labelWidth={4}>
            {createdAt}
          </LabeledInfoItem>
        </Grid>
        <Grid item sm={12} sx={{ mt: 2 }}>
          <LabeledInfoItem label='Owners'>
            {ownership?.map(ownershipItem => (
              <OwnerItem key={ownershipItem.id}>
                {ownershipItem.owner.name}
                <LabelItem labelName={ownershipItem.title?.name} />
                <OwnershipForm
                  termDetailsOwnership={ownershipItem}
                  ownerEditBtn={
                    <OwnerActionBtns>
                      <AppIconButton
                        size='small'
                        color='tertiary'
                        icon={<EditIcon />}
                        sx={{ ml: 1 }}
                      />
                    </OwnerActionBtns>
                  }
                />
                <ConfirmationDialog
                  actionTitle='Are you sure you want to delete this owner?'
                  actionName='Delete Owner'
                  actionText={
                    <>
                      &quot;{ownershipItem.owner.name}&quot; will be deleted permanently.
                    </>
                  }
                  onConfirm={handleOwnershipDelete(ownershipItem.id)}
                  actionBtn={
                    <OwnerActionBtns>
                      <AppIconButton
                        size='small'
                        color='tertiary'
                        icon={<DeleteIcon />}
                        sx={{ ml: 0.5 }}
                      />
                    </OwnerActionBtns>
                  }
                />
              </OwnerItem>
            ))}
            <OwnershipForm
              ownerEditBtn={
                <AppButton
                  sx={{ mt: 0.25 }}
                  size='medium'
                  color='tertiary'
                  startIcon={<AddIcon />}
                >
                  Add Owner
                </AppButton>
              }
            />
          </LabeledInfoItem>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OverviewGeneral;
