import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  intervalId: any;
  templateId: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetTasksByIntervalId = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {myServiceTemplates} = useSelector(
    (state: RootState) => state.ServiceTemplateReducer,
  );

  const getTemplateIntervalTasks = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const template = myServiceTemplates.find((item: any) =>
      item.templates.some(
        (template: any) =>
          template.id.toString() === options?.templateId.toString(),
      ),
    );
    if (template) {
      const tasks = template.templates.flatMap((item: any) => item.tasks);
      const matchingTasks = tasks.filter((item: any) => {
        return (
          item?.task?.interval?.id.toString() ===
            options?.intervalId.toString() &&
          item?.template_id.toString() === options?.templateId.toString()
        );
      });
      console.log('matchingTasks', matchingTasks);
      return matchingTasks.length > 0 ? matchingTasks : [];
    } else {
      return [];
    }
  };

  return [getTemplateIntervalTasks];
};

export default useGetTasksByIntervalId;
