// import PokemonDetails from "../PokemonDetails/PokemonDetails";
import PokemonList from "../PokemonList/PokemonList";
import Search from "../Search/Search";
import './Pokedex.css';

function Pokedex(){
    return(
        <div className="pokedex-wrapper">
      <h1 id="pokedex-heading">Pokedex</h1>
        <Search/>
        <PokemonList/>
        {/* <PokemonDetails/> */}
        </div>
        
    )
}
export default Pokedex;