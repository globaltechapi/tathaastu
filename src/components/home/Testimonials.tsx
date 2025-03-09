import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Tathaastu has transformed how we receive donations. Now donors can see exactly what our children need, and we've seen a 70% increase in meaningful contributions that truly help our kids.",
    author: "Anjali Sharma",
    role: "Orphanage Director",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anjali",
  },
  {
    quote:
      "Our elderly residents have specific needs that are now being met thanks to this platform. The ability to list exactly what items would improve their quality of life has been invaluable.",
    author: "Rajesh Patel",
    role: "Elderly Home Administrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
  },
  {
    quote:
      "As a small NGO, we struggled to communicate our exact needs to donors. This registry system has eliminated the guesswork and allowed us to receive precisely what our community projects require.",
    author: "Priya Kapoor",
    role: "NGO Coordinator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Tathaastu: Transforming Lives Through Giving
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from organizations making a difference with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="italic text-muted-foreground">
                  "{testimonial.quote}"
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                    />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
