// 去除物件中某些欄位
const omitFields = (obj: any, ...props: string[]) => {
  // 透過 ES6 解構產生新的物件
  const result = { ...obj };

  // 刪除指定的欄位
  props.forEach((prop) => {
    delete result[prop];
  });
  return result;
};

export default omitFields;
