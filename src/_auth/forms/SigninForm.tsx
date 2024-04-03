import { SigninValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link,useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"





const SigninForm = () => {

    const navigate = useNavigate()
    const {toast} = useToast();
    const {checkAuthUser,isLoading:isUserLoading} = useUserContext()

    const {mutateAsync:signInAccount} = useSignInAccount();

     // 1. Define your form.
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
        email:'',
        password:'',
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const session = await signInAccount({
            email:values.email,
            password:values.password,
        })
        console.log(session)
        if(!session){
            return toast({title:'Sign in failed.Please try again.'})
        }

        const isLoggedIn = await checkAuthUser();

        if(isLoggedIn){
            form.reset();
            console.log('navigat')
            navigate('/');
        }else{
            toast({title:'Sign up failed.Please try again.'})
        }
    }

    return (
        <>
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col">
                    <img src="/assets/images/logo.svg" alt="logo" />
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">LogIn your to account</h2>
                    <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back! Please enter your details</p>
            
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className="shad-button_primary" type="submit">
                        {isUserLoading ? 
                        (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        )
                        : 
                        (
                            "Sign in"
                        )
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don't have an account?
                        <Link className="text-primary-500 text-semibold ml-1" to='/sign-up'>Sign up</Link>
                    </p>
                </form>
                </div>
            </Form>
        </>
    )
}

export default SigninForm