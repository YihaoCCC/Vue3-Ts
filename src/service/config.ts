let BASE_URL = ''
const TIME_OUT = 5000

if(process.env.NODE_ENV === 'development') {
    BASE_URL = 'https://httpbin.org'
} else if(process.env.NODE_ENV === 'test') {
    BASE_URL = 'https://httpbin/org/test'
} else{
    BASE_URL = 'https://httpbin/org/production'
} 
export {BASE_URL, TIME_OUT}