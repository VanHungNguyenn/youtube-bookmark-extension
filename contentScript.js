;(() => {
	let youtubeLeftControls, youtubePlayer
	let currentVideo = ''
	let currentVideoBookmarks = []

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, videoId } = obj

		if (type === 'NEW') {
			currentVideo = videoId
			newVideoLoaded()
		} else if (type === 'PLAY') {
			youtubePlayer.currentTime = value
		} else if (type === 'DELETE') {
			console.log(value)

			console.log('1', currentVideoBookmarks)

			currentVideoBookmarks = currentVideoBookmarks.filter(
				(bookmark) => bookmark.time != value
			)

			console.log('2', currentVideoBookmarks)

			chrome.storage.sync.set({
				[currentVideo]: JSON.stringify(currentVideoBookmarks),
			})

			response(currentVideoBookmarks)
		}
	})

	const fetchBookmarks = () => {
		return new Promise((resolve) => {
			chrome.storage.sync.get([currentVideo], (obj) => {
				resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
			})
		})
	}

	const newVideoLoaded = async () => {
		const bookmarkBtnExists =
			document.getElementsByClassName('bookmark-btn')[0]

		currentVideoBookmarks = await fetchBookmarks()

		if (!bookmarkBtnExists) {
			const bookmarkBtn = document.createElement('img')

			bookmarkBtn.src = chrome.runtime.getURL('assets/bookmark.png')
			bookmarkBtn.className = 'ytp-button ' + 'bookmark-btn'
			bookmarkBtn.title = 'Click to bookmark current timestamp'

			// button pause/play
			youtubeLeftControls =
				document.getElementsByClassName('ytp-left-controls')[0]

			// video player
			youtubePlayer = document.getElementsByClassName('video-stream')[0]

			youtubeLeftControls.append(bookmarkBtn)
			bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler)
		}
	}

	const addNewBookmarkEventHandler = async () => {
		const currentTime = youtubePlayer.currentTime

		const newBookmark = {
			time: currentTime,
			desc: `Bookmark at ${getTime(currentTime)}`,
		}

		currentVideoBookmarks = await fetchBookmarks()

		chrome.storage.sync.set({
			[currentVideo]: JSON.stringify(
				[...currentVideoBookmarks, newBookmark].sort(
					(a, b) => a.time - b.time
				)
			),
		})
	}

	newVideoLoaded()
})()

// get time
const getTime = (t) => {
	const h = Math.floor(t / 3600)
	const m = Math.floor((t % 3600) / 60)
	const s = Math.floor(t % 60)

	return `${h}:${m}:${s}`
}
