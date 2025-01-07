import {useSearchParams} from "react-router-dom";

export default function useQueryParams() {
  const [ search ] = useSearchParams();
  return Object.fromEntries([...search]);
}