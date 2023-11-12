export default function getCsrfToken() {
    return document.cookie.match(/csrftoken=([^;]*)/)[1];
}