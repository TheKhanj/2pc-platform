export const mockHttpService = {
  call: jest.fn(async () => {
    return {
      status: 200,
      headers: {
        header1: 'RESULT_HEADER_1',
      },
      body: 'RESULT_BODY',
    };
  }),
};
