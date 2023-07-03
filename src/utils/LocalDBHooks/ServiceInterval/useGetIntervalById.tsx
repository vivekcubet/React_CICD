import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  intervalId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetIntervalById = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {myServiceIntervals} = useSelector(
    (state: RootState) => state.ServiceIntervalReducer,
  );

  const getInterval = async (options: GetData): Promise<GetResponse[]> => {
    // const topLevelIntervals = myServiceIntervals.flatMap(obj => obj.intervals);
    const modelIntervals = myServiceIntervals.flatMap(obj =>
      obj.models.flatMap((model: any) => model.intervals),
    );

    const finalInterval = modelIntervals.find(
      (interval: any) =>
        interval.id.toString() === options?.intervalId.toString(),
    );
    console.log(
      finalInterval,
      'GOT INTERVAL====',
      JSON.stringify(myServiceIntervals),
    );
    return finalInterval || null;
  };

  return [getInterval];
};

export default useGetIntervalById;
