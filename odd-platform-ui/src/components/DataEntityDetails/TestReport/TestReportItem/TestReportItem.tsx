import React from 'react';
import { DataEntityRunStatus, DataQualityTest } from 'generated-sources';
import { Collapse, Grid, Typography } from '@mui/material';
import { TestRunStatusItem, AppIconButton } from 'components/shared';
import { MinusIcon, PlusIcon } from 'components/shared/Icons';
import { Link } from 'react-router-dom';
import { DataSetQualityTestsStatusCount } from 'redux/interfaces';
import { useAppPaths } from 'lib/hooks';
import TestItem from './TestItem/TestItem';
import * as S from './TestReportItemStyles';

interface TestReportItemProps {
  suitName: string;
  dataSetId: number;
  dataQATestId: number;
  dataQATestList: DataQualityTest[];
  dataQATestReport: DataSetQualityTestsStatusCount;
}

const TestReportItem: React.FC<TestReportItemProps> = ({
  suitName,
  dataSetId,
  dataQATestId,
  dataQATestList,
  dataQATestReport,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { dataEntityTestPath } = useAppPaths();

  React.useEffect(() => {
    if (dataQATestList.length < 5) setOpen(true);
  }, [dataQATestList]);

  const collapseBtn = (
    <AppIconButton
      sx={{ mr: 1 }}
      color="collapse"
      open={open}
      icon={
        open ? (
          <MinusIcon width={6} height={6} />
        ) : (
          <PlusIcon width={6} height={6} />
        )
      }
      aria-label="expand row"
      onClick={() => setOpen(!open)}
    />
  );

  return (
    <Grid container direction="column" wrap="nowrap">
      <S.TestReportBySuitNameHeader container wrap="nowrap">
        <Grid item>{collapseBtn}</Grid>
        <Grid
          item
          container
          wrap="nowrap"
          onClick={() => setOpen(prevState => !prevState)}
        >
          <Grid item>
            <Typography variant="body1">{suitName}</Typography>
          </Grid>
          <Grid item container justifyContent="flex-end">
            {Object.entries(dataQATestReport).map(
              ([testType, count]) =>
                count !== 0 && (
                  <TestRunStatusItem
                    key={testType}
                    count={count}
                    typeName={
                      testType.toUpperCase() as DataEntityRunStatus
                    }
                    size="small"
                  />
                )
            )}
          </Grid>
        </Grid>
      </S.TestReportBySuitNameHeader>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {open && dataQATestList.length
          ? dataQATestList.map(dataQATest => (
              <Link
                to={dataEntityTestPath(dataSetId, dataQATest.id)}
                key={dataQATest.id}
              >
                <TestItem
                  active={dataQATestId === dataQATest.id}
                  latestRunStatus={dataQATest.latestRun?.status}
                  testName={
                    dataQATest.internalName || dataQATest.externalName
                  }
                  testStartTime={dataQATest.latestRun?.startTime}
                  testEndTime={dataQATest.latestRun?.endTime}
                />
              </Link>
            ))
          : null}
      </Collapse>
    </Grid>
  );
};

export default TestReportItem;
