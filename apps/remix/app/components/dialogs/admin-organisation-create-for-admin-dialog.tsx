import { trpc } from '@documenso/trpc/react';
import { ZCreateAdminOrganisationRequestSchema } from '@documenso/trpc/server/admin-router/create-admin-organisation.types';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type { z } from 'zod';

const ZForm = ZCreateAdminOrganisationRequestSchema.shape.data.pick({ name: true });

type TForm = z.infer<typeof ZForm>;

export const AdminOrganisationCreateForAdminDialog = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { t } = useLingui();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const form = useForm<TForm>({
    resolver: zodResolver(ZForm),
    defaultValues: { name: '' },
  });

  const [ownerQuery, setOwnerQuery] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);

  const { data: searchResults, isLoading: isLoadingUsers } = trpc.admin.search.useQuery(
    { query: ownerQuery },
    { enabled: ownerQuery.trim().length > 0 },
  );

  const users = searchResults?.users ?? [];

  const { mutateAsync: createOrganisation, isPending: isCreating } = trpc.admin.organisation.create.useMutation();

  const onSubmit = async (values: TForm) => {
    if (!selectedOwnerId) {
      toast({
        title: t`Owner required`,
        description: t`Please select an owner for the organisation`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const { organisationId } = await createOrganisation({
        ownerUserId: selectedOwnerId,
        data: { name: values.name },
      });

      toast({ title: t`Success`, description: t`Organisation created`, duration: 5000 });
      setOpen(false);
      navigate(`/admin/organisations/${organisationId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: t`An unknown error occurred`,
        description: t`Please try again later.`,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setOwnerQuery('');
      setSelectedOwnerId(null);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary">
            <Trans>Create Organisation</Trans>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent position="center">
        <DialogHeader>
          <DialogTitle>
            <Trans>Create organisation</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>Create an organisation and assign an owner</Trans>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isCreating} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      <Trans>Organisation Name</Trans>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm text-muted-foreground">
                  <Trans>Owner</Trans>
                </FormLabel>
                <Input
                  placeholder={t`Search users by name or email`}
                  value={ownerQuery}
                  onChange={(e) => setOwnerQuery(e.target.value)}
                />

                <div className="mt-2 max-h-40 overflow-auto rounded-md border">
                  {isLoadingUsers ? (
                    <div className="p-2 text-sm text-muted-foreground">{t`Loading users...`}</div>
                  ) : users.length > 0 ? (
                    users.map((u: any) => (
                      <div
                        key={u.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedOwnerId(u.id)}
                        onKeyDown={() => setSelectedOwnerId(u.id)}
                        className={`p-2 cursor-pointer ${selectedOwnerId === u.id ? 'bg-accent' : ''}`}
                      >
                        <div className="font-medium">{u.name ?? u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">{t`No users found`}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  <Trans>Cancel</Trans>
                </Button>
                <Button type="submit" loading={isCreating}>
                  <Trans>Create</Trans>
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrganisationCreateForAdminDialog;
