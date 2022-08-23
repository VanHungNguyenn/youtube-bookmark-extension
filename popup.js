import { getCurrentTab } from './utils.js'

// adding a new bookmark row to the popup
const addNewBookmark = () => {}

const viewBookmarks = () => {}

const onPlay = (e) => {}

const onDelete = (e) => {}

const setBookmarkAttributes = () => {}

document.addEventListener('DOMContentLoaded', () => {
	const activeTab = getActiveTabURL()

	const queryParameters = activeTab.url.split('?')[1]
	const urlParameters = new URLSearchParams(queryParameters)

	const currentVideo = urlParameters.get('v')

	if (
		activeTab.url.includes('https://www.youtube.com/watch') &&
		currentVideo
	) {
		chrome.storage.sync.get([currentVideo], (data) => {
			const currentVideoBookmarks = data[currentVideo]
				? JSON.parse(data[currentVideo])
				: []

			console.log(currentVideoBookmarks)
		})
	}
})
