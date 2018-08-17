import cats from "./cats"
import lizards from "./lizards"
import birds from "./birds"


const categories = {
    Cats: cats,
    Lizards: lizards,
    Birds: birds,
};

export default Object.values(categories);

export function categoryFromName(name) {
    return categories[name];
}