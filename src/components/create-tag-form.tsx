import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from '@radix-ui/react-dialog';

const createTagSchema = z.object({
    title: z.string().min(3, 'minimun 3 characters.'),
})

type CreateTagSchema = z.infer<typeof createTagSchema>

export function CreateTagForm() {
    const { register, handleSubmit, watch } = useForm<CreateTagSchema>({
        resolver: zodResolver(createTagSchema),
    })

    function createSlug(input: string): string {
        const normalizedString = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const slug = normalizedString.replace(/[^\w\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        return slug;
    }

    const slug = watch('title') ? createSlug(watch('title')) : ''


    function createTag({ title }: CreateTagSchema) {
        console.log({ title, slug })
        fetch('http://localhost:3333/tags', {
            method: 'POST',
            body: JSON.stringify({
                title,
                slug,
                amountOfVideos: 0
            })
        })
    }


    return (
        <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="name">Tag name</label>
                <input
                    id='name'
                    {...register('title')}
                    type="text"
                    className="border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"

                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium block" htmlFor="slug">Slug</label>
                <input
                    id='slug'
                    type="text"
                    readOnly
                    value={slug}
                    className="border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"

                />

            </div>
            <div className="flex gap-2 items-center justify-end">
                <Dialog.Close asChild>
                    <Button>
                        <X className="size-3" />
                        Cancel
                    </Button>
                </Dialog.Close>
                <Button type='submit' className="bg-teal-400 text-teal-950">
                    <Check className="size-3" />
                    Save</Button>
            </div>
        </form>
    )
}