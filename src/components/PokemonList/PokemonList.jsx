import {useEffect, useState} from 'react';
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    const [pokemonListState,setPokemonListState]=useState({
        pokemonList:[],
        isLoading:true,
        pokedexUrl:'https://pokeapi.co/api/v2/pokemon',
        nextUrl:'',
        prevUrl:''
    });

   
    async function downloadPokemons(){
       setPokemonListState((state)=>({...state, isLoading:true}));
        const response=await axios.get(pokemonListState.pokedexUrl);//this downloads list of 20 pokemons

        const pokemonResults=response.data.results;// we get the array of pokemons from results

        // console.log("response is",response.data,response.data.next);
        console.log(response.data);

        setPokemonListState((state)=>({
            ...state,
            nextUrl:response.data.next,
            prevUrl:response.data.previous
        }));

        
    //    setPrevUrl(response.data.previous); // we get the previous url to fetch previous 20 pokemons
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
        
        setPokemonListState((state)=>({
            ...state,
            pokemonList:pokemonListResult,
            isLoading:false
        }));

    }
    useEffect(()=>{
        downloadPokemons();
    },[pokemonListState.pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
        
        <div className="pokemon-wrapper">
            {(pokemonListState.isLoading) ? 'Loading....' :
            pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image}  key={p.id}  id={p.id}/>)
            }
        </div>
        <div className="controls">

        <button disabled={pokemonListState.prevUrl==null} onClick={()=>{
        const urlToSet=pokemonListState.prevUrl;
        setPokemonListState({...pokemonListState,pokedexUrl:urlToSet})
         }}>Prev</button>

        <button disabled={pokemonListState.nextUrl==null} onClick={()=>{
        const urlToSet=pokemonListState.nextUrl;
        setPokemonListState({...pokemonListState,pokedexUrl:urlToSet})
        }}>Next</button>

        </div>
        </div>
    )
}

export default PokemonList;