const searchModelList = (arr: any, searchElement: any) => {
  const matchingModels: any = [];
  arr.forEach(function (element: any) {
    const matchingModelsInElement = element.models.filter(
      (model: any) =>
        model.name &&
        model.name.toLowerCase().includes(searchElement.toLowerCase()),
    );
    if (
      element.name &&
      element.name.toLowerCase().includes(searchElement.toLowerCase()) &&
      matchingModelsInElement.length > 0
    ) {
      matchingModels.push({
        ...element,
        models: matchingModelsInElement,
      });
    } else if (matchingModelsInElement.length > 0) {
      console.log('SORT');
      matchingModels.push({
        ...element,
        models: matchingModelsInElement,
      });
    }
  });
  return matchingModels;
};

export default searchModelList;
