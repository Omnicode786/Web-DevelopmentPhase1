const addfive = require('./addfive')

test('returns the number plus 5', () =>{
    expect(addfive(1)).toBe(6);
})