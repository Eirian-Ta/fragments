const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
} = require('../../src/model/data/memory/index');

describe('fragment db intergrated calls', () => {
  test('writeFragment() writes a fragment metadata to memory db and returns nothing', async() => {
    const testFragment = {
      id: 'testFragmentId',
      ownerId: 'testOwnerId',
    }
    const returnValue = await writeFragment(testFragment);
    expect(await readFragment('testOwnerId', 'testFragmentId')).toEqual(testFragment);
    expect(returnValue).toBe(undefined);
  });

  test('readFragment() returns metadata written in memory db by writeFragment()', async() => {
    const testFragment = {
      id: 'testFragmentId',
      ownerId: 'testOwnerId',
    }
    await writeFragment(testFragment);
    const result = await readFragment('testOwnerId', 'testFragmentId');
    expect(result).toEqual(testFragment);
  });

  test('writeFragmentData() write a fragment data to memory db and returns nothing', async() => {
    const returnValue = await writeFragmentData('testOwnerId', 'testFragmentId','testValue');
    const result = await readFragmentData('testOwnerId', 'testFragmentId');
    expect(result).toEqual('testValue');
    expect(returnValue).toBe(undefined);
  });

  test('readFragmentData() returns data written in memory db by writeFragmentData()', async () => {
    await writeFragmentData('testOwnerId', 'testFragmentId','testValue');
    const result = await readFragmentData('testOwnerId', 'testFragmentId');
    expect(result).toEqual('testValue');
  });

  test('listFragments() return list of ids/objects for the given user from memory db', async () => {
    await writeFragment({ ownerId: 'testOwnerId1', id: 'testFragmentId1', fragment: 'testFragment1' });
    await writeFragment({ ownerId: 'testOwnerId1', id: 'testFragmentId2', fragment: 'testFragment2' });
    await writeFragmentData('testOwnerId1', 'testFragmentId1', 'testFragment1');
    await writeFragmentData('testOwnerId1', 'testFragmentId2', 'testFragment2');
    const result = await listFragments('testOwnerId1');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(2);
    expect(result.every(f => typeof f == 'string')).toBe(true);
  });
})
