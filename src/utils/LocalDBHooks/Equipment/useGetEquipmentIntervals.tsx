import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  equipment: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetEquipmentIntervals = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {myServiceIntervals} = useSelector(
    (state: RootState) => state.ServiceIntervalReducer,
  );
  const {currentHourHistory} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );

  const getEqIntervals = async (options: GetData): Promise<GetResponse[]> => {
    const {equipment} = options;
    let intervalListData = [...myServiceIntervals];
    let intervals = intervalListData.reduce((interval: any, category: any) => {
      const model = category.models.find(
        (modelItem: any) =>
          modelItem.id.toString() === equipment?.model_id.toString(),
      );
      return model ? model.intervals : interval;
    }, []);
    let sortedArray: any = [];
    let finalArray: any = [];
    let hour = equipment?.current_hour ? equipment?.current_hour : 0;

    hour =
      currentHourHistory[equipment.id.toString()] &&
      new Date(equipment?.last_hour_updated) <
        new Date(currentHourHistory[equipment.id.toString()]?.date)
        ? currentHourHistory[equipment.id.toString()]?.hours
        : hour;
    console.log(
      hour,
      'EQUIPMENT=========',

      currentHourHistory[equipment.id.toString()],
      'TEST======',
      currentHourHistory[equipment.id.toString()] &&
        new Date(equipment?.last_hour_updated) <
          new Date(currentHourHistory[equipment.id.toString()]?.date),
    );
    if (intervals.length > 0) {
      finalArray = [...intervals]?.map((item: any) => {
        const remain = Number(item?.interval_hours) - Number(hour);
        return {
          interval: item,
          values: [item?.interval_hours.toString() + 'Hr', remain],
          label: item?.interval_hours,
          id: item?.id,
          value: remain,
        };
      });
    }
    if (intervals && intervals.length > 0) {
      sortedArray = [...finalArray]?.sort(
        (a: any, b: any) => Number(a.label) - Number(b.label),
      );
    }
    return sortedArray;
  };

  return [getEqIntervals];
};

export default useGetEquipmentIntervals;
