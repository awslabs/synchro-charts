import { currentYRange, getYRange } from './getYRange';

describe('compute the y range from data streams', () => {
  it('returns a default y range when there is no data points and no y annotations', () => {
    expect(getYRange({ points: [], yAnnotations: [], startFromZero: false })).toEqual({
      yMin: 1,
      yMax: 1000,
    });
  });

  describe.each`
    exactMin        | exactMax        | min                    | max
    ${0}            | ${0}            | ${-0.5}                | ${0.5}
    ${0}            | ${100000}       | ${-16000}              | ${120000}
    ${0}            | ${1}            | ${-0.16}               | ${1.2000000000000002}
    ${0}            | ${1.5}          | ${-0.24}               | ${1.8}
    ${0}            | ${12}           | ${-1.8}                | ${14}
    ${0}            | ${15}           | ${-2.4000000000000004} | ${18}
    ${0}            | ${149}          | ${-24}                 | ${180}
    ${1}            | ${1}            | ${0.5}                 | ${1.6}
    ${121}          | ${1200}         | ${-42}                 | ${1400}
    ${480}          | ${1199}         | ${360}                 | ${1400}
    ${11234.00123}  | ${11234.00123}  | ${5600}                | ${18000}
    ${-1}           | ${-1}           | ${-1.6}                | ${-0.5}
    ${-1.5}         | ${0}            | ${-1.8}                | ${0.24}
    ${-12}          | ${0}            | ${-14}                 | ${1.8}
    ${-15}          | ${0}            | ${-18}                 | ${2.4000000000000004}
    ${-150}         | ${0}            | ${-180}                | ${24}
    ${-1200}        | ${0}            | ${-1400}               | ${180}
    ${-1200}        | ${-12}          | ${-1400}               | ${180}
    ${-12}          | ${1200}         | ${-200}                | ${1400}
    ${-1}           | ${100}          | ${-18}                 | ${120}
    ${-10}          | ${100}          | ${-28}                 | ${120}
    ${-46}          | ${100}          | ${-68}                 | ${140}
    ${-7090}        | ${1931}         | ${-8600}               | ${3400}
    ${-7090}        | ${-1931}        | ${-8000}               | ${-1000}
    ${-11234.00123} | ${-11234.00123} | ${-18000}              | ${-5600}
  `('compute y range works without starting from zero', ({ exactMin, exactMax, min, max }) => {
    test(`exact range of { yMin: ${exactMin}, yMax: ${exactMax} } => { yMin: ${min}, yMax: ${max} }`, () => {
      expect(
        getYRange({
          points: [
            {
              x: Date.now(),
              y: exactMin,
            },
            {
              x: Date.now(),
              y: exactMax,
            },
          ],
          yAnnotations: [],
          startFromZero: false,
        })
      ).toEqual({
        yMin: min,
        yMax: max,
      });
    });
  });

  describe.each`
    exactMin        | exactMax        | min       | max
    ${0}            | ${0}            | ${-0.5}   | ${0.5}
    ${0}            | ${100000}       | ${0}      | ${120000}
    ${0}            | ${1}            | ${0}      | ${1.2000000000000002}
    ${0}            | ${1.5}          | ${0}      | ${1.8}
    ${0}            | ${12}           | ${0}      | ${14}
    ${0}            | ${15}           | ${0}      | ${18}
    ${0}            | ${149}          | ${0}      | ${180}
    ${1}            | ${1}            | ${0}      | ${1.6}
    ${121}          | ${1200}         | ${0}      | ${1400}
    ${480}          | ${1199}         | ${0}      | ${1400}
    ${11234.00123}  | ${11234.00123}  | ${0}      | ${18000}
    ${-1}           | ${-1}           | ${-1.6}   | ${0}
    ${-1.5}         | ${0}            | ${-1.8}   | ${0}
    ${-12}          | ${0}            | ${-14}    | ${0}
    ${-15}          | ${0}            | ${-18}    | ${0}
    ${-150}         | ${0}            | ${-180}   | ${0}
    ${-1200}        | ${0}            | ${-1400}  | ${0}
    ${-1200}        | ${-12}          | ${-1400}  | ${0}
    ${-12}          | ${1200}         | ${-200}   | ${1400}
    ${-1}           | ${100}          | ${-18}    | ${120}
    ${-10}          | ${100}          | ${-28}    | ${120}
    ${-46}          | ${100}          | ${-68}    | ${140}
    ${-7090}        | ${1931}         | ${-8600}  | ${3400}
    ${-7090}        | ${-1931}        | ${-8000}  | ${0}
    ${-11234.00123} | ${-11234.00123} | ${-18000} | ${0}
  `('compute y range works with starting from zero', ({ exactMin, exactMax, min, max }) => {
    test(`exact range of { yMin: ${exactMin}, yMax: ${exactMax} } => { yMin: ${min}, yMax: ${max} }`, () => {
      expect(
        getYRange({
          points: [
            {
              x: Date.now(),
              y: exactMin,
            },
            {
              x: Date.now(),
              y: exactMax,
            },
          ],
          yAnnotations: [],
          startFromZero: true,
        })
      ).toEqual({
        yMin: min,
        yMax: max,
      });
    });
  });
});

describe('compute the y range from data streams and y annotations', () => {
  describe.each`
    exactMin        | exactMax        | annotationValue1 | annotationValue 2 | min       | max
    ${0}            | ${0}            | ${0}             | ${0}              | ${-0.5}   | ${0.5}
    ${0}            | ${100000}       | ${0}             | ${100500}         | ${-16000} | ${120000}
    ${0}            | ${1}            | ${0}             | ${5}              | ${-0.76}  | ${5.800000000000001}
    ${0}            | ${1.5}          | ${0}             | ${2.5}            | ${-0.38}  | ${3}
    ${1}            | ${1}            | ${1}             | ${1}              | ${0.5}    | ${1.6}
    ${121}          | ${1200}         | ${122}           | ${1201}           | ${-42}    | ${1400}
    ${11234.00123}  | ${11234.00123}  | ${11244.00123}   | ${11244.00123}    | ${10000}  | ${12000}
    ${-1}           | ${-1}           | ${-1}            | ${-1}             | ${-1.6}   | ${-0.5}
    ${-1.5}         | ${0}            | ${-2.5}          | ${0}              | ${-3}     | ${0.38}
    ${-12}          | ${0}            | ${-13}           | ${0}              | ${-16}    | ${2}
    ${-1}           | ${-1}           | ${-2}            | ${-2}             | ${-2.2}   | ${-0.84}
    ${-1200}        | ${-12}          | ${-1300}         | ${-11}            | ${-1600}  | ${200}
    ${-12}          | ${1200}         | ${-13}           | ${1220}           | ${-200}   | ${1600}
    ${-1}           | ${100}          | ${-1}            | ${100}            | ${-18}    | ${120}
    ${-10}          | ${100}          | ${-12}           | ${120}            | ${-32}    | ${140}
    ${-7090}        | ${1931}         | ${-8090}         | ${2931}           | ${-9800}  | ${4600}
    ${-7090}        | ${-1931}        | ${-7190}         | ${-1931}          | ${-8000}  | ${-1000}
    ${-11234.00123} | ${-11234.00123} | ${-11235.00123}  | ${-11235.00123}   | ${-12000} | ${-10000}
  `(
    'compute y range works without starting from zero',
    ({ exactMin, exactMax, annotationValue1, annotationValue2, min, max }) => {
      test(`exact range of { yMin: ${exactMin}, yMax: ${exactMax},
      yAnnotation Value 1: ${annotationValue1}, yAnnotation Value 2: ${annotationValue2} =>
       { yMin: ${min}, yMax: ${max} }`, () => {
        expect(
          getYRange({
            points: [
              {
                x: Date.now(),
                y: exactMin,
              },
              {
                x: Date.now(),
                y: exactMax,
              },
            ],
            yAnnotations: [
              {
                color: 'black',
                value: annotationValue1,
                showValue: true,
              },
              {
                color: 'black',
                value: annotationValue2,
                showValue: true,
              },
            ],
            startFromZero: false,
          })
        ).toEqual({
          yMin: min,
          yMax: max,
        });
      });
    }
  );

  describe.each`
    exactMin        | exactMax        | annotationValue1 | annotationValue 2 | min       | max
    ${0}            | ${0}            | ${0}             | ${0}              | ${-0.5}   | ${0.5}
    ${0}            | ${100000}       | ${0}             | ${100500}         | ${0}      | ${120000}
    ${0}            | ${1}            | ${0}             | ${5}              | ${0}      | ${5.800000000000001}
    ${0}            | ${1.5}          | ${0}             | ${2.5}            | ${0}      | ${3}
    ${1}            | ${1}            | ${1}             | ${1}              | ${0}      | ${1.6}
    ${121}          | ${1200}         | ${122}           | ${1201}           | ${0}      | ${1400}
    ${11234.00123}  | ${11234.00123}  | ${11244.00123}   | ${11244.00123}    | ${0}      | ${12000}
    ${-1}           | ${-1}           | ${-1}            | ${-1}             | ${-1.6}   | ${0}
    ${-1.5}         | ${0}            | ${-2.5}          | ${0}              | ${-3}     | ${0}
    ${-12}          | ${0}            | ${-13}           | ${0}              | ${-16}    | ${0}
    ${-1}           | ${-1}           | ${-2}            | ${-2}             | ${-2.2}   | ${0}
    ${-1200}        | ${-12}          | ${-1300}         | ${-11}            | ${-1600}  | ${0}
    ${-12}          | ${1200}         | ${-13}           | ${1220}           | ${-200}   | ${1600}
    ${-1}           | ${100}          | ${-1}            | ${100}            | ${-18}    | ${120}
    ${-10}          | ${100}          | ${-12}           | ${120}            | ${-32}    | ${140}
    ${-7090}        | ${1931}         | ${-8090}         | ${2931}           | ${-9800}  | ${4600}
    ${-7090}        | ${-1931}        | ${-7190}         | ${-1931}          | ${-8000}  | ${0}
    ${-11234.00123} | ${-11234.00123} | ${-11235.00123}  | ${-11235.00123}   | ${-12000} | ${0}
  `(
    'compute y range works without starting from zero',
    ({ exactMin, exactMax, annotationValue1, annotationValue2, min, max }) => {
      test(`exact range of { yMin: ${exactMin}, yMax: ${exactMax},
      yAnnotation Value 1: ${annotationValue1}, yAnnotation Value 2: ${annotationValue2} =>
       { yMin: ${min}, yMax: ${max} }`, () => {
        expect(
          getYRange({
            points: [
              {
                x: Date.now(),
                y: exactMin,
              },
              {
                x: Date.now(),
                y: exactMax,
              },
            ],
            yAnnotations: [
              {
                color: 'black',
                value: annotationValue1,
                showValue: true,
              },
              {
                color: 'black',
                value: annotationValue2,
                showValue: true,
              },
            ],
            startFromZero: true,
          })
        ).toEqual({
          yMin: min,
          yMax: max,
        });
      });
    }
  );
});

describe('currentYRange', () => {
  it('returns default y range if no points regardless of start from zero or not.', () => {
    const yRange = currentYRange();
    expect(yRange({ points: [], yAnnotations: [], startFromZero: false })).toEqual({ yMin: 1, yMax: 1000 });
    expect(yRange({ points: [], yAnnotations: [], startFromZero: true })).toEqual({ yMin: 1, yMax: 1000 });
  });

  it('returns y range when points provided', () => {
    const yRange = currentYRange();
    expect(
      yRange({
        points: [
          { y: 10, x: Date.now() },
          { y: 3000, x: Date.now() },
        ],
        yAnnotations: [],
        startFromZero: true,
      })
    ).toEqual({
      yMin: 0,
      yMax: 3600,
    });
  });

  it('returns y ranges when only y annotations are provided', () => {
    const yRange = currentYRange();
    expect(
      yRange({
        points: [],
        yAnnotations: [
          {
            color: 'black',
            value: 10,
            showValue: true,
          },
          {
            color: 'black',
            value: -10,
            showValue: true,
          },
        ],
        startFromZero: false,
      })
    ).toEqual({
      yMin: -14,
      yMax: 14,
    });
  });

  it('returns last y range if called for a second time with no points without start from zero', () => {
    const yRange = currentYRange();
    yRange({
      points: [
        { y: 10, x: Date.now() },
        { y: 3000, x: Date.now() },
      ],
      yAnnotations: [],
      startFromZero: false,
    });
    // Check it is not default values
    expect(yRange({ points: [], yAnnotations: [], startFromZero: false })).not.toEqual({ yMin: 1, yMax: 1000 });
    expect(yRange({ points: [], yAnnotations: [], startFromZero: false })).toEqual({ yMin: -440, yMax: 3600 });
  });

  it('returns last y range if called for a second time with no points and start from zero', () => {
    const yRange = currentYRange();
    yRange({
      points: [
        { y: 10, x: Date.now() },
        { y: 3000, x: Date.now() },
      ],
      yAnnotations: [],
      startFromZero: true,
    });
    // Check it is not default values
    expect(yRange({ points: [], yAnnotations: [], startFromZero: true })).not.toEqual({ yMin: 1, yMax: 1000 });
    expect(yRange({ points: [], yAnnotations: [], startFromZero: true })).toEqual({ yMin: 0, yMax: 3600 });
  });
});
