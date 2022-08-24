import { getCurrentTab } from './utils.js'

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
	const bookmarkTitleElement = document.createElement('div')
	const newBookmarkElement = document.createElement('div')
	const controlsElement = document.createElement('div')

	bookmarkTitleElement.textContent = bookmark.desc
	bookmarkTitleElement.className = 'bookmark-title'

	controlsElement.className = 'bookmark-controls'

	newBookmarkElement.id = `bookmark-${bookmark.time}`
	newBookmarkElement.className = 'bookmark'
	newBookmarkElement.setAttribute('timestamp', bookmark.time)

	setBookmarkAttributes('play', onPlay, controlsElement)
	setBookmarkAttributes('delete', onDelete, controlsElement)

	newBookmarkElement.appendChild(bookmarkTitleElement)
	newBookmarkElement.appendChild(controlsElement)
	bookmarksElement.appendChild(newBookmarkElement)
}

const viewBookmarks = (currentBookmarks = []) => {
	console.log({ currentBookmarks })
	const bookmarksElement = document.getElementById('bookmarks')
	bookmarksElement.innerHTML = ''

	if (currentBookmarks.length > 0) {
		for (let i = 0; i < currentBookmarks.length; i++) {
			const bookmark = currentBookmarks[i]
			addNewBookmark(bookmarksElement, bookmark)
		}
	} else {
		bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>'
	}
}

const onPlay = (e) => {}

const onDelete = (e) => {}

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
	const controlElement = document.createElement('img')

	controlElement.src = `assets/${src}.png`
	controlElement.title = src
	controlElement.addEventListener('click', eventListener)
	controlParentElement.appendChild(controlElement)
}

document.addEventListener('DOMContentLoaded', async () => {
	const activeTab = await getCurrentTab()

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

			viewBookmarks(currentVideoBookmarks)
		})
	} else {
		let container = document.getElementsByClassName('container')[0]

		container.innerHTML =
			'<div class="title">This is not a youtube video page.</div>'
	}
})
