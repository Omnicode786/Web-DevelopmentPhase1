const {addFive, showconsole} = require('./addFive');

test('returns the number plus 5', () => {
    expect(addFive(3)).toBe(8);
})

const spyConsoleLog = jest.spyOn(console, 'log')
spyConsoleLog.mockImplementation(keys => keys)

test('returns true if the function showconsole is defiend', function(){
    expect(showconsole).toBeDefined()
})

test('test console log inside', function(){
    showconsole(true);
    expect(spyConsoleLog.mock.calls[0][0]).toBe(true);
    spyConsoleLog.mockRestore()

})
