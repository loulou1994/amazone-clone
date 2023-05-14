export default function removeDuplicates(data){
    let filteredArray = [];
    data.forEach((item) => {
      const isAdded = filteredArray.some((item) => item.category === item.category);
      !isAdded && filteredArray.push(item);
    });
    return filteredArray;
}