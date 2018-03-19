const initMaskedInputs = () => {
	$('.maskdocument').mask('AAAAAAAAAAAAA', {
		translation: {
			A: { pattern: /[A-Za-z0-9]/ }
		}
	});
};
