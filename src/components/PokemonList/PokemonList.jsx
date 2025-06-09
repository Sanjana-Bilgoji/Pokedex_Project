import {useEffect, useState} from 'react';
import axios from 'axios';
import './PokemonList.css';
import Pokemon from '../Pokemon/Pokemon';

function PokemonList(){

    const[pokemonList,setPokemonList]=useState([]);
    const[isLoading,setIsLoading]=useState(true);

    const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon'); // URL to fetch next set of pokemons

    const[nextUrl,setNextUrl]=useState('');
    const[prevUrl, setPrevUrl]=useState('');

    const POKEDEX_URL='https://pokeapi.co/api/v2/pokemon';
    async function downloadPokemons(){
        setIsLoading(true);
        const response=await axios.get(POKEDEX_URL);//this downloads list of 20 pokemons

        const pokemonResults=response.data.results;// we get the array of pokemons from results

        console.log(response.data);
        setPokedexUrl(response.data.next); // we get the next url to fetch next 20 pokemons
        setPrevUrl(response.data.prev); // we get the previous url to fetch previous 20 pokemons
        const pokemonResultPromise=pokemonResults.map((pokemon)=>axios.get(pokemon.url));

        const pokemonData=await axios.all(pokemonResultPromise);
        console.log(pokemonData);
        // passing that promice to axios.all to get all the pokemon data

        const pokemonListResult =pokemonData.map((pokeData)=>{
            const pokemon=pokeData.data;
            return{
                id:pokemon.id,
                name:pokemon.name,
                image:(pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_default,
                types:pokemon.types
            }
        });
        console.log(pokemonListResult);
        setPokemonList(pokemonListResult);
        setIsLoading(false);
    }
    useEffect(()=>{
        downloadPokemons();
    },[pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
        <div>Pokemon List</div>
        <div className="pokemon-wrapper">
            {(isLoading) ? 'Loading...' :
            pokemonList.map((p) => <Pokemon name={p.name} image={p.image}  key={p.id} />)
            }
        </div>
        <div className="controls">
        <button disabled={prevUrl==null} onClick={()=> setPokedexUrl(prevUrl)}>Prev</button>
        <button disabled={prevUrl==null} onClick={()=> setPokedexUrl(prevUrl)}>Next</button>

        </div>
        </div>
    )
}
export default PokemonList;