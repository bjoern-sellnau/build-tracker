/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Mariadb from 'mariadb';
import setup from '../setup';

describe('withMariadb setup', () => {
  let query, release, setupFn;
  beforeEach(() => {
    query = jest.fn();
    release = jest.fn();
    // @ts-ignore
    jest.spyOn(Mariadb, 'createPool').mockImplementation(() => ({
      // @ts-ignore
      getConnection: () => Promise.resolve({ query, release })
    }));

    setupFn = setup(Mariadb.createPool({}));
  });

  test('creates the table if not exists', () => {
    return setupFn().then(result => {
      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith(expect.stringMatching('CREATE TABLE IF NOT EXISTS builds'));
    });
  });

  test('creates a multi-index', () => {
    return setupFn().then(() => {
      expect(query).toHaveBeenCalledWith(
        'CREATE INDEX IF NOT EXISTS parent ON builds (revision, parentRevision, branch)'
      );
    });
  });

  test('creates an index on timestamp', () => {
    return setupFn().then(() => {
      expect(query).toHaveBeenCalledWith('CREATE INDEX IF NOT EXISTS timestamp ON builds (timestamp)');
    });
  });

  test('releases the client on complete', () => {
    return setupFn().then(() => {
      expect(release).toHaveBeenCalled();
    });
  });

  test('releases the client on error', () => {
    const error = new Error('tacos');
    query.mockReturnValueOnce(Promise.reject(error));
    return setupFn().catch(err => {
      expect(release).toHaveBeenCalled();
      expect(err).toBe(error);
    });
  });
});
