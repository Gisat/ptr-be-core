import filesystem from 'fs';

export const expectBasicNodeContent = (parseResult: any, expectedObject: any) => {
  expect(parseResult).toHaveProperty("nodeType", expectedObject.nodeType);
  expect(parseResult).toHaveProperty("nameInternal", expectedObject.nameInternal);
  expect(parseResult).toHaveProperty("nameDisplay", expectedObject.nameDisplay);
  expect(parseResult).toHaveProperty("description", expectedObject.description);
  expect(parseResult["noParam"]).toBeUndefined();
}

/**
 * Assert two JS objects with expected functions
 * @param expected How the object supposed to be
 * @param actual How it is
 */
export const expectObject = (expected: any, actual: any) => {
  Object.keys(expected).every(expectedKey => {
    const expectedValue = expected[expectedKey];
    expect(actual).toHaveProperty(expectedKey, expectedValue);
  });
}

/**
 * Assert two arrays
 * @param expected 
 * @param actual 
 * @returns 
 */
export const expectArrayCompare = (expected: any[], actual: any[]) =>
  expected.forEach((result, index) => expect(result).toEqual(actual[index]));

/**
 * Deletes folder from filesystem - testing generated content
 * @param folderPath 
 */
export const cleanTestTemporaryFolder = (folderPath: string) => filesystem.rmSync(folderPath, { recursive: true });