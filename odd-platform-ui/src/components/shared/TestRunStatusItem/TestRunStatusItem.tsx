import React from 'react';
import { DataEntityRunStatus } from 'generated-sources';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';
import * as S from './TestRunStatusItemStyles';

interface TestRunStatusItemProps {
  count?: number;
  typeName: DataEntityRunStatus;
  size?: 'large' | 'small';
  sx?: SxProps<Theme>;
}

const TestRunStatusItem: React.FC<TestRunStatusItemProps> = ({
  size = 'large',
  typeName,
  count,
  sx,
}) => (
  <S.Container title={typeName} sx={sx}>
    {size === 'small' ? (
      <S.FilledContainer $typeName={typeName}>{count}</S.FilledContainer>
    ) : (
      <S.FilledContainer variant="body2" $typeName={typeName}>
        {count} {typeName?.toLowerCase()}
      </S.FilledContainer>
    )}
  </S.Container>
);

export default TestRunStatusItem;
