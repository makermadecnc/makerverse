import { TypedDocumentNode, useQuery } from '@apollo/client';

export type State = 'pending' | 'success' | 'error';

export interface IRead<TRet> {
  read: () => TRet | Error;
}

// https://github.com/apollographql/apollo-feature-requests/issues/162
export function suspend<TRet>(promise: Promise<TRet>): IRead<TRet> {
  let status: State = 'pending';
  let response: TRet | Error;

  const suspender = promise.then(
    (res: TRet) => {
      status = 'success';
      response = res;
    },
    (err: Error) => {
      status = 'error';
      response = err;
    }
  );

  const read = () => {
    if (status === 'pending') throw suspender;
    if (status === 'error') throw response;
    return response;
  };

  return { read };
}

function useSuspendableQuery<TQuery, TVars>(doc: TypedDocumentNode<TQuery, TVars>) {
  const result = useQuery<TQuery, TVars>(doc);
  if (result.loading) {
    suspend(new Promise((resolve) => !result.loading && resolve(result.data))).read();
  }
  return result;
}
