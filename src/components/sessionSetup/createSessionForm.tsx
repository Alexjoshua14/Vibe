"use client"

import { FC } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { createSession } from "@/lib/queue-session/session-management"
import { setStatus } from "@/redux/reducers/status"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { useToast } from "../ui/use-toast"

interface CreateSessionFormProps { }

const formSchema = z.object({
  sessionName: z.string().min(1).max(50),
  public: z.boolean(),
})

const CreateSessionForm: FC<CreateSessionFormProps> = ({ }) => {
  const dispatch = useDispatch()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionName: "",
      public: false,
    },
  })

  const sessionCreation = async (data: z.infer<typeof formSchema>) => {
    console.log("We're here")
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)

    toast({
      title: "Creating session...",
      description: "Please wait while we create your session.",
    })

    try {
      console.log("Creating session...")

      let res = await createSession()

      console.log("Res has returned! " + res)

      if (res) {
        dispatch(setStatus("HOST"))
      } else {
        console.log("Whoops, throwing")
        throw new Error()
      }
    } catch (err) {
      console.log("Whoops, something went wrong!")

      if (typeof err == "string") {
        console.error("Failed to create session: " + err)
        toast({
          title: "Failed to create session",
          description: `The problem seems to be: ${err}\nPlease try again. If problem persists, contact support.`,
        })
      } else {
        console.error("Failed to create session: " + err)

        toast({
          title: "Failed to create session",
          description:
            "Please try again. If problem persists, contact support.",
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8 rounded p-4 glassmorphism bg-secondary"
      >
        <FormField
          control={form.control}
          name="sessionName"
          render={({ field }) => (
            <FormItem className="p-4 glassmorphism rounded">
              <FormLabel {...field}>Session Name</FormLabel>
              <FormControl>
                <Input placeholder="Session Name" {...field} />
              </FormControl>
              <FormDescription>The name of your session</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-8 p-4 rounded glassmorphism">
              <div className="spae-y-0.5">
                <FormLabel {...field}>Public</FormLabel>
                <FormDescription>
                  Do you want your session to be publicly listed?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="glassmorphism-secondary-interactive">
          Create Session
        </Button>
      </form>
    </Form>
  )
}

export default CreateSessionForm
