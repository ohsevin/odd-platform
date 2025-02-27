import { AlertStatus } from 'generated-sources';
import styled from 'styled-components';

interface FilledContainerProps {
  $typeName: AlertStatus;
}

const typeChecker = (type: AlertStatus) => (type === 'OPEN' ? 'OPEN' : 'RESOLVED');

export const Container = styled('div')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const FilledContainer = styled('span')<FilledContainerProps>(
  ({ theme, $typeName }) => ({
    fontSize: theme.typography.body2.fontSize,
    lineHeight: theme.typography.body2.lineHeight,
    borderRadius: '12px',
    border: '1px solid',
    padding: theme.spacing(0.25, 1),
    backgroundColor: theme.palette.alert[typeChecker($typeName)].background,
    borderColor: theme.palette.alert[typeChecker($typeName)].border,
  })
);
