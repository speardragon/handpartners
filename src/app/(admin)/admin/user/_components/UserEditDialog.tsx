"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import useDialogOpenStore from "@/store/useDialogOpenStore";
import { useForm } from "react-hook-form";
import { ProfileUpdateFormSchema } from "../_lib/ProfileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSignatureUploadUrl,
  getSignatureDownloadUrl,
  deleteUser,
  updateUser,
  UserRow,
} from "@/actions/user-actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload, X } from "lucide-react";
import { userQueries } from "@/queries";
import { USER_ROLES } from "@/constants/auth";
import Image from "next/image";

type Props = {
  userId?: string;
  userProfile: Partial<UserRow>;
};

export default function UserEditDialog({ userId, userProfile }: Props) {
  const { open, setOpen } = useDialogOpenStore((state) => state);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProfileUpdateFormSchema>>({
    resolver: zodResolver(ProfileUpdateFormSchema),
    mode: "onSubmit",
  });

  const {
    formState: { dirtyFields },
  } = form;

  useEffect(() => {
    form.setValue("username", userProfile.username ?? "");
    form.setValue("role", userProfile.role ?? "");
    form.setValue("email", userProfile.email ?? "");
    form.setValue("affiliation", userProfile.affiliation ?? "");
    form.setValue("position", userProfile.position ?? "");
    form.setValue("phone_number", userProfile.phone_number ?? "");
    form.setValue("signature_url", userProfile.signature_url ?? "");
    setSignatureFile(null);
    if (userProfile.signature_url) {
      getSignatureDownloadUrl(userProfile.signature_url)
        .then(({ downloadUrl }) => {
          setSignaturePreview(downloadUrl);
        })
        .catch(() => {
          setSignaturePreview(null);
        });
    } else {
      setSignaturePreview(null);
    }
  }, [userProfile, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    setSignatureFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSignaturePreview(objectUrl);
  };

  const handleRemoveSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
    form.setValue("signature_url", "", { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadSignature = async (file: File): Promise<string> => {
    const { uploadUrl, publicUrl } = await createSignatureUploadUrl({
      fileName: file.name,
      contentType: file.type,
    });

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    return publicUrl;
  };

  const onSubmit = async (data: z.infer<typeof ProfileUpdateFormSchema>) => {
    type UserData = z.infer<typeof ProfileUpdateFormSchema>;
    const updatedData: Record<string, string | undefined> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof UserData;
      if (dirtyFields[fieldKey] && data[fieldKey] !== undefined) {
        updatedData[fieldKey] = data[fieldKey];
      }
    });

    try {
      setIsUploading(true);

      if (signatureFile) {
        const signatureUrl = await uploadSignature(signatureFile);
        updatedData["signature_url"] = signatureUrl;
      }

      if (Object.keys(updatedData).length > 0) {
        await updateUser({ ...updatedData, id: userId });
        queryClient.invalidateQueries({ queryKey: userQueries.all() });
        setOpen(false);
        toast.success("유저 정보를 수정하였습니다.");
      } else {
        toast.error("수정사항이 존재하지 않습니다.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "수정에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteHandler = async (userId: string) => {
    const confirmation = window.confirm("정말로 이 사용자를 삭제하시겠습니까?");
    if (!confirmation) return;

    await deleteUser(userId);
    toast.success("사용자가 삭제되었습니다.");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: userQueries.all() });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg">사용자 정보 수정</DialogTitle>
          <DialogDescription>사용자의 정보를 수정합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      이름 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      구분 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("role");
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="구분을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={USER_ROLES.JUDGE}>
                            심사자
                          </SelectItem>
                          <SelectItem value={USER_ROLES.ADMIN}>
                            관리자
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    이메일
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="이메일" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      소속
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="소속" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      직급
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="직급" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    전화번호
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="전화번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">
                서명 업로드
              </FormLabel>
              <div className="space-y-2">
                {signaturePreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={signaturePreview}
                      alt="서명 미리보기"
                      width={80}
                      height={40}
                      className="rounded border border-neutral-200 object-contain"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                      onClick={handleRemoveSignature}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Label
                      htmlFor="signature-upload"
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50"
                    >
                      <Upload className="h-4 w-4" />
                      이미지를 선택해주세요
                    </Label>
                    <Input
                      id="signature-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
            </FormItem>

            <div className="border-t border-neutral-100 pt-4">
              <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
                <Button
                  onClick={() => deleteHandler(userId ?? "")}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit" size="sm" disabled={isUploading}>
                    {isUploading ? "업로드 중..." : "수정하기"}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
