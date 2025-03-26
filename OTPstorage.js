// class TempStorage{
//     constructor(){
//         this.storage=new Map();
//     }
//     set(email,otp,duration=200000){
//         this.storage.set(email,otp);
//         setTimeout(()=>this.storage.delete(email),duration);
//     }
//     verify(email,otp){
//         return this.storage.get(email)===Number(otp);
//     }
//     delete(email){
//         this.storage.delete(email); 
//     }
//     getAll(){
//         return this.storage;
//     }
// }
// module.exports=new TempStorage();

class TempStorage {
    constructor() {
        this.storage = new Map();
    }

    set(email, otp, duration = 200000) {
        this.storage.set(email, Number(otp)); // Ensure OTP is stored as a number
        setTimeout(() => this.storage.delete(email), duration);
    }

    verify(email, otp) {
        return this.storage.has(email) && this.storage.get(email) === Number(otp);
    }

    delete(email) {
        this.storage.delete(email);
    }

    getAll() {
        let result = {};
        this.storage.forEach((otp, email) => {
            result[email] = otp;
        });
        return result; // Returns as a JSON object instead of Map()
    }
}

module.exports = new TempStorage();
