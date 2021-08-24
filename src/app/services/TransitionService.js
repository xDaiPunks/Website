let Instance;

class TransitionService {
	constructor() {
		if (!Instance) {
			Instance = this;
		}

		return Instance;
	}

	updateTransition(props, nodeName) {
		let i;
		let children;
		let childrenCount;
		let animationType;

		let containerNode = document.querySelector('.ViewContainer');

		if (!containerNode || !containerNode.children) {
			return;
		}

		animationType = props.animationType;

		children = containerNode.children;
		childrenCount = containerNode.children.length;

		if (childrenCount > 1) {
			if (animationType === 'overlay') {
				for (i = 0; i < childrenCount; i++) {
					if (i === 0) {
						children[i].style.zIndex = 40;
					}

					if (i > 0) {
						if (children[i].classList.contains('Overlay')) {
							children[i].classList.add('Underlay');
							children[i].classList.remove('Overlay');
							if (i === 1) {
								children[i].style.zIndex = 20;
							} else {
								children[i].style.zIndex = 20 - (i + 1);
							}
						}

						if (children[i].classList.contains('Underlay')) {
							if (i === 1) {
								children[i].style.zIndex = 20;
							} else {
								children[i].style.zIndex = 20 - (i + 1);
							}
						}
					}
				}
			}
			if (animationType === 'underlay') {
				for (i = 0; i < childrenCount; i++) {
					if (i === 0) {
						children[i].style.zIndex = 20;
					}

					if (i > 0) {
						if (children[i].classList.contains('Underlay')) {
							children[i].classList.add('Overlay');
							children[i].classList.remove('Underlay');

							if (i === 1) {
								children[i].style.zIndex = 40;
							} else {
								children[i].style.zIndex = 40 - (i + 1);
							}

							if (children[i].classList.contains('Overlay')) {
								if (i === 1) {
									children[i].style.zIndex = 40;
								} else {
									children[i].style.zIndex = 40 - (i + 1);
								}
							}
						}
					}
				}
			}
		}
	}
}

export default TransitionService;
