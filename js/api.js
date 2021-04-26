export class Api {
    async search(q, pageNum) {
        q = `https://openlibrary.org/search.json?q=${q}&page=${pageNum}`;
        const result = await fetch(q);
        return await result.json();
    }
}



//fetch(`${API_URL}/${dateFormatted}?base=${BASE_RATE}`)