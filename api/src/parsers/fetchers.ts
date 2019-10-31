import fetch from 'node-fetch'
import querystring from 'querystring'
import URL from 'url'

const TINYYTREGEXP = /youtu\.be\/(?<youtubeId>[^\/:]{1,})(\/)?$/
const GITHUBREGEXP = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?github\.com(\/)(?<username>[^\/:]+)(\/)(?<repos>[^\/:]+).*?$/

/* -------- FETCHERS DEFINITION --------  */
export function SimpleFetch(url: string): Promise<string> {
    return fetch(url, {
        // Some website check useragent
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
        },
    })
        .then(res => {
            if (res.status === 404) {
                throw Error(`Url ${url} return 404`)
            }
            return res
        })
        .then(res => res.text())
}

export function getGithubId(url: string) {
    const matches = url.match(GITHUBREGEXP)
    if (
        matches !== undefined &&
        matches !== null &&
        matches.groups !== undefined &&
        matches.groups.username !== undefined &&
        matches.groups.repos !== undefined
    ) {
        return matches.groups
    } else {
        throw Error(`Unable to get repository and username in ${url}`)
    }
}

export function GithubApiFetch(url: string): Promise<string> {
    console.log(`Fetch github api: ${url}`)
    const matches = url.match(GITHUBREGEXP)
    if (
        matches !== undefined &&
        matches !== null &&
        matches.groups !== undefined
    ) {
        return fetch(
            `https://api.github.com/repos/${matches.groups.username}/${matches.groups.repos}`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_API_KEY}`,
                },
            }
        ).then(res => res.text())
    } else {
        throw Error(`Unable to get repos and username in ${url}`)
    }
}

export const getYoutubeId = (url: string) => {
    const matchTiny = url.match(TINYYTREGEXP)
    if (
        matchTiny !== null &&
        matchTiny !== undefined &&
        matchTiny.groups !== undefined
    ) {
        return matchTiny.groups.youtubeId
    } else {
        const query = URL.parse(url).query
        if (query === undefined || query === null) {
            throw Error(`Can not find query parameter in YT url ${url}`)
        }
        return querystring.parse(query).v.toString()
    }
}

export function YoutubeApiFetch(url: string): Promise<string> {
    console.log(`Fetch youtube api: ${url}`)
    const youtubeId = getYoutubeId(url)
    return fetch(
        `https://www.googleapis.com/youtube/v3/videos/?part=statistics,contentDetails,snippet&id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    ).then(res => res.text())
}
