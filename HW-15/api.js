// Запрос данных в API на комментарий
const host = "https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments"
export function getComments() {
    return fetch(host, {
        method: "GET"
    }).then((response) => {
       return response.json()
    });

};
export function postComment(name, text) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
            name: name,
            text: text,
            forceError: true,
        })
    })
}
