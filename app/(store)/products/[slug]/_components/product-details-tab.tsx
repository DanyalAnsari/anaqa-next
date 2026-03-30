import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDetailTabsProps {
  product: {
    description: string | null;
    tags: string[];
  };
}

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  return (
    <div className="mt-12">
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              Details & Care
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description || "No description available."}
              </p>
              {product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="pt-6">
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Materials</h4>
                <p>Premium quality fabrics carefully selected for comfort and durability.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Care Instructions</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not dry clean</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="pt-6">
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Shipping</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Free standard shipping on orders over 200 SAR</li>
                  <li>Standard shipping (5–7 business days): 25 SAR</li>
                  <li>International shipping available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Returns</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>30-day return policy</li>
                  <li>Items must be unworn with tags attached</li>
                  <li>Refunds processed within 5–7 business days</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description || "No description available."}
              </p>
              {product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="details">
            <AccordionTrigger>Details & Care</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Materials</h4>
                  <p>Premium quality fabrics carefully selected for comfort and durability.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Care Instructions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Machine wash cold with like colors</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                    <li>Iron on low heat if needed</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping & Returns</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Shipping</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Free standard shipping on orders over 200 SAR</li>
                    <li>Standard shipping (5–7 business days): 25 SAR</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Returns</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>30-day return policy</li>
                    <li>Items must be unworn with tags attached</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}