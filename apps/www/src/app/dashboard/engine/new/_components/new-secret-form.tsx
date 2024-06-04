'use client';

import React from 'react';
import { type FieldErrors, useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { Plus, Trash2 } from 'lucide-react';

/* eslint-disable @typescript-eslint/restrict-template-expressions -- form field number as control register */

export const NewSecretForm = () => {
  'use no memo';
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secrets: [
        {
          name: '',
          value: '',
          type: 'number',
        },
      ],
    },
  });

  const onSubmit = (values: FormType) => {
    console.log(values);
  };

  const onError = (errors: FieldErrors<FormType>) => {
    console.log(errors);
    toast.error(errors.secrets?.root?.message ?? 'An error occurred.');
  };

  const array = useFieldArray({
    control: form.control,
    name: 'secrets',
  });

  return (
    <div className='flex w-full flex-col px-3'>
      <div className='mb-5 flex flex-row items-center justify-between border-b border-neutral-300 pb-3'>
        <h1 className='text-3xl font-semibold text-neutral-700'>
          Create Secret
        </h1>
        <Button
          className='flex flex-row items-center gap-2 !text-xs'
          type='button'
          onClick={() => array.append({ name: '', value: '', type: 'number' })}
        >
          <Plus size={16} />
          New Secret
        </Button>
      </div>
      <Form {...form}>
        <form
          className='space-y-8'
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          <div className='flex w-full flex-col gap-2'>
            <FormField
              control={form.control}
              name={`path`}
              render={({ field }) => (
                <FormItem className='w-full max-w-xs'>
                  <FormControl>
                    <Input placeholder='Secret Path' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {array.fields.map((item, index) => {
              const type = form.watch(`secrets.${index}.type`);
              return (
                <div
                  key={item.id}
                  className='flex w-full flex-row items-start gap-2'
                >
                  <FormField
                    control={form.control}
                    name={`secrets.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='w-full max-w-xs'>
                        <FormControl>
                          <Input placeholder='Secret Name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {type === 'string' ? (
                    <FormField
                      control={form.control}
                      name={`secrets.${index}.value`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <Input
                              className='w-full'
                              placeholder='Secret Value '
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={`secrets.${index}.value`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <Input
                              className='w-full'
                              placeholder='Secret Value'
                              type='number'
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name={`secrets.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='string'>String </SelectItem>
                            <SelectItem value='number'>Number</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className='aspect-square p-0 text-red-600'
                    type='button'
                    variant='outline'
                    onClick={() => array.remove(index)}
                  >
                    <span className='sr-only'>Remove</span>
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
          <Button type='submit'>Store Secrets</Button>
        </form>
      </Form>
    </div>
  );
};

const secretSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  type: z.union([z.literal('string'), z.literal('number')]),
});

const formSchema = z
  .object({
    path: z.string().min(1),
    secrets: z.array(secretSchema).min(1),
  })
  .refine(
    (data) => {
      const names = data.secrets.map((secret) => secret.name);
      if (new Set(names).size !== names.length) {
        return false;
      }
      return true;
    },
    {
      message: 'Secret names must be unique.',
      path: ['secrets'],
    }
  );

type FormType = z.infer<typeof formSchema>;
