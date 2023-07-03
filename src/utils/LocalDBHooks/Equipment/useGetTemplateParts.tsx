import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

export interface GetData {
  templateId: any;
  intervalId?: any;
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useGetTemplateParts = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const {myServiceTemplates} = useSelector(
    (state: RootState) => state.ServiceTemplateReducer,
  );

  const getTemplateParts = async (options: GetData): Promise<GetResponse[]> => {
    const foundTemplate = await myServiceTemplates
      .flatMap(category => category.templates)
      .find(
        template =>
          template?.id?.toString() === options?.templateId?.toString(),
      );
    console.log(foundTemplate, 'TEMPLATES===========');
    let result_array = [];
    if (foundTemplate) {
      result_array = foundTemplate.tasks.reduce((acc: any, taskItem: any) => {
        console.log(taskItem, 'TASK===========');
        let parts = null;
        if (
          options.intervalId &&
          taskItem?.task?.interval_id.toString() ===
            options.intervalId.toString()
        ) {
          parts = taskItem?.task?.parts;
        } else if (!options.intervalId) {
          parts = taskItem?.task?.parts;
        }
        if (parts && parts !== null) {
          parts.forEach((part: any) => {
            const category = part.part.category?.name;
            const existingCategory = acc.find(
              (item: any) => item.category === category,
            );

            if (existingCategory) {
              existingCategory.parts.push({
                description: part.part.description,
                part_no: part.part.part_no,
                quantity: part.quantity,
                measurement_type:
                  part.part.measurement_type.name === 'piece' ? 'Pc' : 'L',
                parts_id: part.parts_id,
              });
            } else {
              acc.push({
                category,
                parts: [
                  {
                    description: part.part.description,
                    part_no: part.part.part_no,
                    quantity: part.quantity,
                    measurement_type:
                      part.part.measurement_type.name === 'piece' ? 'Pc' : 'L',
                    parts_id: part.parts_id,
                  },
                ],
              });
            }
          });
        }

        return acc;
      }, []);
    }
    console.log(result_array, 'TEMPLATES===========1111');
    return result_array;
  };

  return [getTemplateParts];
};

export default useGetTemplateParts;
