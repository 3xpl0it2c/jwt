function compose(f, g) {
	return (...args) => g( f(...args) );
}

module.exports = {
	compose,
};

