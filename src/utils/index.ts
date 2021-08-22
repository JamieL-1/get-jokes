// Rather than defining each state value as all the values are boolean
// just define the key as string so we can object keys/foreach over it
export interface iState {
	[key: string]: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const selectedCategories = (categories: iState) => {
	let tempSelectedCategories = ''
	Object.keys(categories).forEach((category: string) => {
		if (categories[category]) {
			tempSelectedCategories += `${category},`
		}
	})
	return tempSelectedCategories.slice(0, -1)
}
