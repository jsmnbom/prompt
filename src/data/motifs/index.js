import birds from "./birds"
import bridges from "./bridges"
import cats from "./cats"
import dogs from "./dogs"
import insects from "./insects"
import lizards from "./lizards"
import people from "./people"
import trees from "./trees"
// import test from "./test"


const categories = {
    Birds: birds,
    Bridges: bridges,
    Cats: cats,
    Dogs: dogs,
    Insects: insects,
    Lizards: lizards,
    People: people,
    Trees: trees,
    // Test: test
};

export default Object.values(categories);

export function categoryFromName(name) {
    return categories[name];
}