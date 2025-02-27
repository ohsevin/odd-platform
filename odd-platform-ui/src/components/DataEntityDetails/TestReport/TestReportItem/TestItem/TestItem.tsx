import React from 'react';
import { Grid, Typography } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import { DataEntityRunStatus } from 'generated-sources';
import { TestRunStatusIcon } from 'components/shared';
import { Container } from './TestitemStyles';

interface TestItemProps {
  active: boolean;
  latestRunStatus: DataEntityRunStatus | undefined;
  testName: string;
  testStartTime: Date | undefined;
  testEndTime: Date | undefined;
}

const TestItem: React.FC<TestItemProps> = ({
  active,
  latestRunStatus,
  testName,
  testStartTime,
  testEndTime,
}) => (
  <Container container $active={active}>
    <Grid item xs={0.25}>
      {latestRunStatus && <TestRunStatusIcon typeName={latestRunStatus} />}
    </Grid>
    <Grid container item wrap="nowrap" xs={11.75}>
      <Grid item xs={10}>
        <Typography variant="body1" noWrap>
          {testName}
        </Typography>
      </Grid>
      <Grid item container xs={2} justifyContent="flex-end">
        <Typography variant="body1">
          {testEndTime &&
            testStartTime &&
            formatDistanceStrict(testEndTime, testStartTime, {
              addSuffix: false,
            })}
        </Typography>
      </Grid>
    </Grid>
  </Container>
);
export default TestItem;
