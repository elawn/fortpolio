import './style.css'
import Experience from './Experience/Experience'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )
const exp = new Experience( document.querySelector( '#cvs' ) )
