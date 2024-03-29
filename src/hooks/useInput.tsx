import { useState } from 'react';

const UseInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  const reset = () => {
    setValue(initialValue);
  };

  const bind = {
    value,
    onChange: (e: any) => {
      setValue(e.target.value);
    }
  };
  return [value, bind, reset];
};

export default UseInput;
