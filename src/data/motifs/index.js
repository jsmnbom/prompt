import birds from "./birds"
import cats from "./cats"
import dogs from "./dogs"
import insects from "./insects"
import lizards from "./lizards"
import trees from "./trees"


const categories = {
    Birds: birds,
    Cats: cats,
    Dogs: dogs,
    Insects: insects,
    Lizards: lizards,
    Trees: trees
};

export default Object.values(categories);

export function categoryFromName(name) {
    return categories[name];
}