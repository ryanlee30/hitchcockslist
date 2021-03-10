import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import date from 'date-and-time';

export default class Reviews {
    constructor(reviews) {
        this.reviews = reviews;
    }

    getReviews() {
        let parsed = JSON.parse(this.reviews).reviews;
        let reviews = [];
        if (parsed) {
            for (let review of parsed) {
                reviews.push({
                    review: new QuillDeltaToHtmlConverter(review.review.ops).convert(),
                    date: date.format(new Date(review.date), "MMMM DD, YYYY")
                });
            }
        }
        return reviews;
    }

    // to be used in ViewReviews.js
    addReview(review) {
        // returns the JSON string form of new JS array of review objects
        return JSON.stringify(this.getReviews().push(review));
    }

    // to be used in ViewReviews.js
    removeReview(content) {
        // keep in mind we do not allow duplicate reviews
        // returns the JSON string form of new JS array of review objects
        return JSON.stringify(this.getReviews().filter(rev => rev.content !== content));
    }
}