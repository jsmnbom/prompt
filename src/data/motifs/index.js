import cats from "./cats"
import lizards from "./lizards"
import birds from "./birds"
import insects from "./insects"
import trees from "./trees"


const categories = {
    Cats: cats,
    Lizards: lizards,
    Birds: birds,
    Insects: insects,
    Trees: trees
};

export default Object.values(categories);

export function categoryFromName(name) {
    return categories[name];
}