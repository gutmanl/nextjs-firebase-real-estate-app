export default function imageUrlFormatter(url: string) {
    return `https://firebasestorage.googleapis.com/v0/b/nextjs-15-and-firebase-6d96e.firebasestorage.app/o/${
        encodeURIComponent(url)}?alt=media`
}